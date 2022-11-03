package config

import com.amazonaws.auth.profile.{ProfileCredentialsProvider => ProfileCredentialsProviderV1}
import com.amazonaws.auth.{AWSCredentialsProviderChain => AWSCredentialsProviderChainV1, InstanceProfileCredentialsProvider => InstanceProfileCredentialsProviderV1}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}

object AWS {
  lazy val defaultAppName = "atom-workshop"
  lazy val profile = "composer"

  lazy val credentials: AwsCredentialsProviderChain = AwsCredentialsProviderChain.builder().credentialsProviders(
    ProfileCredentialsProvider.create(profile),
    InstanceProfileCredentialsProvider.create()
  ).build()

  lazy val credentialsV1 = new AWSCredentialsProviderChainV1(
    new ProfileCredentialsProviderV1("composer"),
    new InstanceProfileCredentialsProviderV1(false)
  )
}
